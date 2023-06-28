const { PrismaClient } = require('@prisma/client');

async function adicionarUsuario(name, mail, pwd) {
    const prisma = new PrismaClient();

    try {
        const usuario = await prisma.User.create({
            data: {
                name: nome,
                email: mail,
                empresa: empres,
                password: pass
            },
        });

        console.log('Usuário adicionado:', usuario);
    } catch (error) {
        console.error('Erro ao adicionar usuário:', error);
    } finally {
        await prisma.$disconnect();
    }
}