const authController = require('../../src/controllers/authController');
const usuarioModel = require('../../src/models/usuarioModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Mocks
jest.mock('../../src/models/usuarioModel');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('Auth Controller', () => {
    describe('Registrar', () => {
        it('debería registrar un nuevo usuario', async () => {
            const req = {
                body: {
                    nombre: 'Sebas Saldana',
                    email: 'sebas@example.com',
                    contrasenia: 'password123',
                    rol: 'Operador',
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            bcrypt.hash.mockResolvedValue('hashed_password');
            usuarioModel.crearUsuario.mockResolvedValue({
                id: 5,
                nombre: 'Sebas Saldana',
                email: 'sebas@example.com',
                contrasenia: 'hashed_password',
                rol: 'Operador',
                fecha_registro: new Date(),
            });

            await authController.registrar(req, res);

            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
            expect(usuarioModel.crearUsuario).toHaveBeenCalledWith(
                'Sebas Saldana',
                'sebas@example.com',
                'hashed_password',
                'Operador'
            );
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ usuario: expect.any(Object) });
        });
    });
});
