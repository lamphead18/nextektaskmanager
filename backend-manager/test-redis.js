const redis = require('redis');

const client = redis.createClient({
  socket: {
    host: 'localhost',
    port: 6379,
  },
});

async function testConnection() {
  try {
    await client.connect();
    console.log('✅ Conexão com Redis estabelecida com sucesso!');

    await client.set('teste-node', 'funcionando', 'EX', 300);
    const value = await client.get('teste-node');

    console.log('🔍 Valor recuperado do Redis:', value);

    await client.quit();
  } catch (error) {
    console.error('❌ Erro ao conectar ao Redis:', error);
  }
}

testConnection();
