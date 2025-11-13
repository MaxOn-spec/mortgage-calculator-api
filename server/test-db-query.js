const mysql = require('mysql2/promise');

async function test() {
    try {
        const connection = await mysql.createConnection({
            host: '127.0.0.1',
            user: 'root',
            password: 'Admin@123_DB',
            database: 'databasename'
        });
        
        console.log('Testing simple query...');
        const [simpleResult] = await connection.execute('SELECT 1 as test');
        console.log('Simple query OK:', simpleResult);
        
        console.log('Testing users table query...');
        const [usersResult] = await connection.execute('SELECT * FROM users WHERE tgId = ?', ['425670420']);
        console.log('Users query OK:', usersResult);
        
        console.log('Testing exact error query...');
        const [exactResult] = await connection.execute('SELECT `tgId`, `username`, `firstName`, `lastName`, `langCode`, `invitedBy`, `isActive`, `createdAt`, `updatedAt` FROM `Users` WHERE `Users`.`tgId` = ?', ['425670420']);
        console.log('Exact query OK:', exactResult);
        
        await connection.end();
    } catch (error) {
        console.error('MySQL Error:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
    }
}

test();