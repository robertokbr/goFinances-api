import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionRepository from '../repositories/TransactionsRepository';
import app from '../app';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionRepository = getCustomRepository(TransactionRepository);
    const transaction = await transactionRepository.findOne({
      where: { id },
    });

    if (transaction) {
      await transactionRepository.remove(transaction);
      throw new AppError('', 201);
    }
    throw new AppError('transaction not found', 400);
  }
}

export default DeleteTransactionService;
