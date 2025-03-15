import MaxeyTS from './lib/maxeyTS';
import { MaxeyServerResponse } from './lib/types';

const PORT = Number(process.env.PORT) || 8000;

const maxeyTS = new MaxeyTS();

maxeyTS.route('POST', '/tony', (req: Request, res: MaxeyServerResponse) => {
	res.status(200).json('success');
});

maxeyTS.listen(PORT, () => {
	console.log('Server started on port 8000');
});
