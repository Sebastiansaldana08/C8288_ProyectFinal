//Con el token obtenido, se pueden crear recursos 


//GESTIÓN DE RECURSOS: Permitir a usuarios autenticados crear, ver, actualizar y eliminar recursos según su rol.
//acá se usaría el middleware de autenticación "autenticar, autorizar" de authMiddleware
//cuáles son esas opciones? Las siguientes (se especifican en el repo):
//crearRecurso
//obtenerRecursos
//actualizarRecurso
//eliminarRecurso

//ROLES SEGÚN REPOSITORIO:
/*
-Administrador
-Operador
-Usuario autenticado
/*

// Crear recurso - solo Administradores y Operadores
router.post('/', autorizar(['Administrador', 'Operador']), recursoController.crearRecurso);

// Obtener recursos - cualquier usuario autenticado
router.get('/', autorizar(), recursoController.obtenerRecursos);

// Actualizar recurso - solo Administradores
router.put('/:id', autorizar(['Administrador']), recursoController.actualizarRecurso);

// Eliminar recurso - solo Administradores
router.delete('/:id', autorizar(['Administrador']), recursoController.eliminarRecurso);

module.exports = router;
*/