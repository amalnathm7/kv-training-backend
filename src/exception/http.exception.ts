class HttpException extends Error {
    public status: number;
    public statusMessage: string;

    constructor(status: number, errorMessage: string, statusMessage: string) {
        super(errorMessage);
        this.status = status;
        this.statusMessage = statusMessage;
    }
}

export default HttpException;