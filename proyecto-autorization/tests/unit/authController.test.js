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
            expect(res.json).toHaveBeenCalledWith({
                usuario: expect.objectContaining({
                    id: 5,
                    nombre: 'Sebas Saldana',
                    email: 'sebas@example.com',
                    rol: 'Operador',
                }),
            });
        });
    });

    describe('Login', () => {
        it('debería autenticar un usuario y devolver un token', async () => {
            const req = {
                body: {
                    email: 'sebas@example.com',
                    contrasenia: 'password123',
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            const usuarioMock = {
                id: 5,
                nombre: 'Sebas Saldana',
                email: 'sebas@example.com',
                contrasenia: 'hashed_password',
                rol: 'Operador',
            };

            usuarioModel.encontrarUsuarioPorEmail.mockResolvedValue(usuarioMock);
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue('mocked_token');

            await authController.login(req, res);

            expect(usuarioModel.encontrarUsuarioPorEmail).toHaveBeenCalledWith('sebas@example.com');
            expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashed_password');
            expect(jwt.sign).toHaveBeenCalledWith(
                { id: 5, rol: 'Operador' },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
            expect(res.status).not.toHaveBeenCalledWith(400); // No debería haber errores
            expect(res.json).toHaveBeenCalledWith({ token: 'mocked_token' });
        });
    });
});
