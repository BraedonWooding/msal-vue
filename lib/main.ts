import { AuthenticationResult, Configuration, PublicClientApplication } from "@azure/msal-browser";
import { PopupWindowAttributes } from "@azure/msal-browser/dist/utils/PopupUtils";
import { AccountInfo, ScopeSet } from "@azure/msal-common";

export class MsalLayer {
    private msalInstance: PublicClientApplication;

    public constructor(config: Configuration) {
        this.msalInstance = new PublicClientApplication(config);
    }

    public get instance() {
        return this.msalInstance;
    }

    public async loginPopup(scopes: ScopeSet = new ScopeSet(['user.read', 'openid', 'profile', 'email']), popupConfig?: PopupWindowAttributes): Promise<AuthenticationResult> {
        return await this.msalInstance.loginPopup({
            scopes: scopes.asArray(),
            popupWindowAttributes: popupConfig,
            prompt: "select_account"
        });
    }

    public async logout(): Promise<void> {
        return await this.msalInstance.logoutPopup();
    }

    public user(): AccountInfo | undefined {
        const currentAccounts = this.msalInstance.getAllAccounts();
        // no user has signed in
        if (!currentAccounts || currentAccounts.length === 0) return undefined;

        // improvements in future could be to handle this a bit cleaner... but for now it's fine.
        return currentAccounts[0];
    }

    public async acquireToken(scopes: ScopeSet = new ScopeSet(['user.read'])): Promise<AuthenticationResult> {
        let resp: AuthenticationResult;

        try {
            resp = await this.msalInstance.acquireTokenSilent({
                scopes: scopes.asArray(),
                account: this.user()
            })
        } catch (err) {
            // silent sometimes fails, so let's just try popup
            resp = await this.msalInstance.acquireTokenPopup({
                scopes: scopes.asArray(),
                account: this.user()
            })
        }

        return resp;
    }

    public isAuthenticated(): boolean {
        const accounts = this.msalInstance.getAllAccounts();
        return accounts && accounts.length > 0;
    }
}
