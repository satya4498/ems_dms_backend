const { serverDayjs } = require("@src/libs/dayjs");
const { createBulkFakeTransaction } = require("./bankingTransactionSeeder");
const { createBulkFakeUsers } = require("./bulkUserSeeder");
const { createBulkCasinoTransaction } = require("./casinoSeeder");
const { seedBulkSBTransactions } = require("./sportsbookSeeder");
const { issueFakeBonuses } = require("./issueBonusSeeder");


(async function runner() {
  console.time('---------------------------------------------COMPLETED')
  for (let index = 0; index < +process.argv[2] || 1; index++) {
    console.time('---------------------------------------------START ' + index);
    await createBulkFakeUsers(1000);
    await createBulkFakeTransaction(100, { fromDate: serverDayjs().subtract(2, 'month').valueOf(), toDate: serverDayjs().subtract(1, 'month').valueOf()});
    await createBulkCasinoTransaction(100);
    await seedBulkSBTransactions(100);
    await createBulkFakeTransaction(7, { fromDate: serverDayjs().subtract(7, 'days').valueOf(), toDate: serverDayjs().endOf('day').valueOf()});
    await issueFakeBonuses(100, { fromDate: serverDayjs().subtract(7, 'days').valueOf(), toDate: serverDayjs().endOf('day').valueOf()})
    console.timeEnd('---------------------------------------------START ' + index);
  }
  console.timeEnd('---------------------------------------------COMPLETED')
}())
