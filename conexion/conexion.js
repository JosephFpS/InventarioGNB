const sql = require('mssql');

const config = {
    user: 'sa', // Cambia esto por tu usuario
    password: 'administrador', // Cambia esto por tu contraseña
    server: 'Q99012811\\SQLEXPRESS2022', // Cambia esto por tu IP o nombre de servidor
    database: 'InventarioSudamerisGNB', // Cambia esto por tu base de datos
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

const getConnection = async () => {
    try {
        const pool = await sql.connect(config);
        console.log('✅ Conectado a SQL Server');
        return pool;
    } catch (error) {
        console.error('❌ Error de conexión:', error);
        throw error;    
    }
};

module.exports = getConnection;  // ✅ Ahora exportamos una función
