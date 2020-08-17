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
// import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();
const upload = multer(uploadConfig);

transactionsRouter.get('/', async (request, response) => {
  const transactionRepository = getCustomRepository(TransactionsRepository);
  const categoryRepository = getRepository(Category);

  const balance = await transactionRepository.getBalance();
  const transactionsWithoutBalance = await transactionRepository.find();
  // const transaction = transactionsWithoutBalance.map( transaction =>)


});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;

  const createTransaction = new CreateTransactionService();
  const transaction = createTransaction.execute({
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
  await deletReturn.execute(id);



  
  return response.status(204);
});

transactionsRouter.post('/import',upload.single('file') ,
 async (request, response) => {
const adress = path.resolve(__dirname, '..','..', 'tmp','4e32df26139d9927ea-logo.pnga-logo.png')
const importTransactions = new ImportTransactionsService();

const transactions = importTransactions.execute(request.file.path);

});

export default transactionsRouter;
