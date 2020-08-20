import { Router } from 'express';
import { getCustomRepository, getRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import Category from '../models/Category';
import uploadConfig from '../config/upload';
import multer from 'multer';
import path from 'path';
import ImportTransactionsService from '../services/ImportTransactionsService';


const transactionsRouter = Router();
const upload = multer(uploadConfig);

transactionsRouter.get('/', async (request, response) => {
  const transactionRepository = getCustomRepository(TransactionsRepository);
  const balance = await transactionRepository.getBalance();
  const transactions = await transactionRepository.find();

return response.json({transactions, balance})
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;

  const createTransaction = new CreateTransactionService();
  const transaction = await createTransaction.execute({
    title,
    value,
    type,
    category,
  });
  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;
  const deletReturn = new DeleteTransactionService();
  await deletReturn.execute({id});

  return response.status(204).send();
});

transactionsRouter.post('/import',upload.single('file') ,
 async (request, response) => {
const importTransactions = new ImportTransactionsService();
const transactions = await importTransactions.execute(request.file.path);
return response.json({transactions});
});

export default transactionsRouter;
