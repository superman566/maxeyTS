import MaxeyTS from "./lib/maxeyTS";

const PORT = Number(process.env.PORT) || 8000;

const maxeyTS = new MaxeyTS();

maxeyTS.route("POST", "/tony", (req: Request, res: Response) => {
	console.log("POST + tony");
});

maxeyTS.listen(PORT, () => {
	console.log("Server started on port 8000");
});
