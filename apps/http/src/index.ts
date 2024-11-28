
import express from 'express';
import { router } from './routes/v1';
import cors from 'cors';


const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/v1', router);

app.listen(process.env.PORT || 8000 , () => {
    console.log(`Server is running on port ${process.env.PORT || 8000}`);
});



