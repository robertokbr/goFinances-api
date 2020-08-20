import csvParse from 'csv-parse';
import fs from 'fs';
import Transaction from '../models/Transaction';
import {getRepository, In, getCustomRepository } from 'typeorm';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface CSVTransaction {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class ImportTransactionsService {
  async execute(filePath: string): Promise<Transaction[] | void> {
    const categoryRepository = getRepository(Category);
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const transactions: CSVTransaction[]  = [];
    const categories: string[] = [];


    const contactReadStream = fs.createReadStream(filePath)
    const parsers = csvParse({
      from_line: 2,
    });
    const parseCSV = contactReadStream.pipe(parsers);

    parseCSV.on('data', async line =>{
      const [title, type, value, category] = line.map((cell : string)=>(
        cell.trim()
      ));
        if(!title || !type || !value ) return;

        categories.push(category);
        transactions.push({title, type, value, category});

    })
    await new Promise( resolve => parseCSV.on('end', resolve));

    const categoryExists = await categoryRepository.find({ where:{ title: In(categories)}});
    const categoryExistsTitle = categoryExists.map( category => category.title);

    const addCategory = categories.filter( category => !categoryExistsTitle.includes(category))
    .filter((value, index, self)=> self.indexOf(value) === index );

    const newCategories = categoryRepository.create(
      addCategory.map( title => ({
        title,
      }))
    );
    await categoryRepository.save(newCategories);
    
    const allCurrentFileCategory = [...categoryExists, ...newCategories];

    const createdTransactions = transactionsRepository.create(
      transactions.map( transaction => ({
        title: transaction.title,
        type: transaction.type,
        value: transaction.value,
        category: allCurrentFileCategory.find(
          category => category.title === transaction.category
        )
      })));
      await transactionsRepository.save(createdTransactions);
      await fs.promises.unlink(filePath);

        return createdTransactions;
  }

}

export default ImportTransactionsService;
