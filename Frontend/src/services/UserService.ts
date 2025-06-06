/**
 * Service for managing user session and identification
 */
export class UserService {
    private static instance: UserService;
    private userId: string | null = null;

    private constructor() {}

    /**
     * Get singleton instance of the service
     */
    public static getInstance(): UserService {
        if (!UserService.instance) {
            UserService.instance = new UserService();
        }
        return UserService.instance;
    }

    /**
     * Get the current user ID, prompting if not already set
     */
    public getUserId(): string {
        if (!this.userId) {
            this.userId = this.promptForUserId();
        }
        return this.userId;
    }

    /**
     * Set the user ID manually
     */
    public setUserId(userId: string): void {
        this.userId = userId;
    }

    /**
     * Clear the current user ID
     */
    public clearUserId(): void {
        this.userId = null;
    }

    /**
     * Check if a user is currently logged in
     */
    public isLoggedIn(): boolean {
        return this.userId !== null;
    }

    /**
     * Prompt the user to enter their name/ID
     */
    private promptForUserId(): string {
        let userId = prompt("Enter your name to start shopping:");

        // Keep prompting until we get a valid non-empty string
        while (!userId || userId.trim() === "") {
            userId = prompt("Please enter a valid name to continue:");
        }

        return userId.trim();
    }
}
