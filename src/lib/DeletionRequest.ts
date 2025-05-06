export class DeletionRequest {
    isValid() {
        return this.reason != "" && this.requestedId != "";
    }
    public requestedId: string;
    public reason: string;

    constructor(data: Partial<DeletionRequest>) {
        this.requestedId = data.requestedId ?? "";
        this.reason = data.reason ?? "";
    }

    json() {
        return {
            requestedId: this.requestedId,
            reason: this.reason
        }
    }
}