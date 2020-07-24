import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionRepository = getCustomRepository(TransactionRepository);
    const transactionToDelete = await transactionRepository.findOne({
      where: { id },
    });

    if (transactionToDelete) {
      await transactionRepository.remove(transactionToDelete);
      return;
    }
    throw new AppError('transaction not found', 400);
  }
}

export default DeleteTransactionService;
