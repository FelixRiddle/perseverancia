export interface StatusMessage {
	type: "error" | "success",
    message: string,
    error?: boolean,
}
