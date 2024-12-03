const request = require('supertest');
const app = require('../../src/app');
const pool = require('../../src/config/dbConfig');

beforeAll(async () => {
    // Eliminar los registros dependientes en recursos
    await pool.query('DELETE FROM recursos');

    // Luego eliminar los usuarios
    await pool.query('DELETE FROM usuarios');

    // Reiniciar el contador de IDs
    await pool.query('ALTER SEQUENCE usuarios_id_seq RESTART WITH 1');
});


afterAll(async () => {
    await pool.end();
});

describe('Auth Routes', () => {
    it('debería registrar un nuevo usuario', async () => {
        const res = await request(app)
            .post('/auth/register')
            .send({
                id: 1,
                nombre: 'Gonzalo Saldana',
                email: 'gonzalo@example.com',
                contrasenia: 'securepassword',
                rol: 'Administrador',
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body.usuario).toHaveProperty('id', 1);
        expect(res.body.usuario.email).toBe('gonzalo@example.com');
    });

    it('debería iniciar sesión y devolver un token', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({
                email: 'gonzalo@example.com',
                contrasenia: 'securepassword',
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });
});
