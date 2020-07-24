import { Router } from 'express';
import { getCustomRepository, getRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import Category from '../models/Category';
// import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

// transactionsRouter.get('/', async (request, response) => {
//   const transactionRepository = getCustomRepository(TransactionsRepository);
//   const balance = await transactionRepository.getBalance();
//   const categoryRepository = getRepository(Category);
//   const transactions = await transactionRepository.find({
//     join: { Category },
//     where: { category_id, id },
//     select: {},
//   });
// });

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

// transactionsRouter.post('/import', async (request, response) => {
//   // TODO
// });

export default transactionsRouter;
