import { AuthenticationResult, Configuration, PublicClientApplication } from "@azure/msal-browser";
import { PopupWindowAttributes } from "@azure/msal-browser/dist/utils/PopupUtils";
import { AccountInfo, ScopeSet } from "@azure/msal-common";

class MsalVueMethodError extends Error {
    constructor(method: string) {
        const methodName = `login${method.slice(0, 1).toUpperCase() + method.slice(1)}`;
        const msg = `Method is set to '${method}', use ${methodName}() or login() instead.`;
        super(msg);
        this.name = 'MsalVueMethodError';
    }
}

export class MsalLayer {
    private msalInstance: PublicClientApplication;
    private method: string;
    private redirectUri: string | undefined;

    public constructor(config: Configuration, customConfig: { method?: string | undefined } | undefined) {
        // msal-vue specific configuration items.
        this.method = customConfig?.method === 'redirect' ? 'redirect' : 'popup' ?? 'popup';
        this.redirectUri = config.auth.redirectUri;

        this.msalInstance = new PublicClientApplication(config);
    }

    public get instance() {
        return this.msalInstance;
    }

    public async login(scopes: ScopeSet = new ScopeSet(['user.read', 'openid', 'profile', 'email']), popupConfig?: PopupWindowAttributes): Promise<AuthenticationResult | null> {
        switch (this.method) {
            case 'redirect':
                return this.loginRedirect(scopes);
            case 'popup':
            default:
                return this.loginPopup(scopes, popupConfig);
        }
    }

    public async loginPopup(scopes: ScopeSet = new ScopeSet(['user.read', 'openid', 'profile', 'email']), popupConfig?: PopupWindowAttributes): Promise<AuthenticationResult> {
        if (this.method !== 'popup') throw new MsalVueMethodError(this.method);

        return await this.msalInstance.loginPopup({
            scopes: scopes.asArray(),
            popupWindowAttributes: popupConfig,
            prompt: "select_account"
        });
    }

    public async loginRedirect(scopes: ScopeSet = new ScopeSet(['user.read', 'openid', 'profile', 'email'])): Promise<AuthenticationResult | null> {
        if (this.method !== 'redirect') throw new MsalVueMethodError(this.method);
        if (!this.redirectUri) throw new Error('Redirect URI must be defined if using the "redirect" login method.');
        
        const response = await this.msalInstance.handleRedirectPromise();
        await this.msalInstance.loginRedirect({
            scopes: scopes.asArray(),
            redirectUri: this.redirectUri,
            prompt: "select_account"
        });

        return response;
    }

    public async logout(): Promise<void> {
        if (this.method === 'popup') return await this.msalInstance.logoutPopup();
        return await this.msalInstance.logoutRedirect();
    }

    public user(): AccountInfo | undefined {
        const currentAccounts = this.msalInstance.getAllAccounts();
        // no user has signed in
        if (!currentAccounts || currentAccounts.length === 0) return undefined;

        // improvements in future could be to handle this a bit cleaner... but for now it's fine.
        return currentAccounts[0];
    }

    public async acquireToken(scopes: ScopeSet = new ScopeSet(['user.read'])): Promise<AuthenticationResult | null> {
        let resp: AuthenticationResult | null;

        try {
            resp = await this.msalInstance.acquireTokenSilent({
                scopes: scopes.asArray(),
                account: this.user()
            });
        } catch (err) {
            // silent sometimes fails, so let's just try manual intervention
            if (this.method === 'popup') {
                resp = await this.msalInstance.acquireTokenPopup({
                    scopes: scopes.asArray(),
                    account: this.user()
                });
            } else {
                if (!this.redirectUri) throw new Error('Could not acquire token: Redirect URI must be defined.');

                resp = await this.msalInstance.handleRedirectPromise();
                await this.msalInstance.acquireTokenRedirect({
                    scopes: scopes.asArray(),
                    account: this.user(),
                    redirectUri: this.redirectUri,
                });
            }
        }

        return resp;
    }

    public async isAuthenticated(): Promise<boolean> {
        if (this.method === 'redirect') await this.msalInstance.handleRedirectPromise();
        const accounts = this.msalInstance.getAllAccounts();
        return accounts && accounts.length > 0;
    }
}
