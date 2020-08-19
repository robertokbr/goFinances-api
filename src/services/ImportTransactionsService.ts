// import csvParse from 'csv-parse';
// import fs from 'fs';
// import Transaction from '../models/Transaction';
// import path from 'path';

// class ImportTransactionsService {
//   async execute(filePath: string): Promise<Transaction[] | void> {

//     const transactions = [];
//     const category = [];


//     const contactReadStream = fs.createReadStream(filePath)
//     const parsers = csvParse({
//       from_line: 2,
//     });
//     const parseCSV = contactReadStream.pipe(parsers);

//     parseCSV.on('data', async line =>{
//       const [title, type, value, category] = line.map((cell : string)=>(
//         cell.trim()
//       ));
//         if(!title || !type || !value ) return;

//     })

//   }
// }

// export default ImportTransactionsService;
