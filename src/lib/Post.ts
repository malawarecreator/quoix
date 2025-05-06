export class Post {
    isValid() {
        return this.id != "" && this.explanation != "" && this.code != "" && this.title != "";
    }
    public id: string;
    public explanation: string;
    public code: string;
    public title: string;

    constructor(data: Partial<Post>) {
        this.id = data.id ?? "";
        this.explanation = data.explanation ?? "";
        this.code = data.code ?? "";
        this.title = data.title ?? "";
    }

    json() {
        return {
            id: this.id,
            explanation: this.explanation,
            code: this.code,
            title: this.title
        }
    }
}