import { EntityRepository, Repository, getRepository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const repository = getRepository(Transaction);
    const allTransactions = await repository.find();

    const income = allTransactions.reduce(
      (a, b) => a + (b.type === 'income' ? b.value : 0),
      0,
    );
    const outcome = allTransactions.reduce(
      (a, b) => a + (b.type === 'outcome' ? b.value : 0),
      0,
    );
    const total = income - outcome;

    return { income, outcome, total };
  }
}

export default TransactionsRepository;
