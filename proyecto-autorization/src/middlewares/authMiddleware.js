//Se usa el módulo jsonwebtoken para verificar que el token es el que el servidor envió al cliente
const jwt = require('jsonwebtoken');

//Este middleware se encargará de la autenticación
const autenticar = (req, res, next) => {
    //El token se enviará en el header de la solicitud, y se usa .split, porque se enviará en la forma "Bearer {token}"
    const token = req.header('Authorization')?.split(' ')[1];

    //Si no hay un token como tal, el middleware denegará el acceso antes de que la solicitud llegue al endpoint
    if (!token){
        return res.status(401).json({error:'Acceso denegado.'});
    };

    //Caso contrario, si el cliente envía un token en el header del request, se verifica que este sea el mismo token que se envió inicialmente
    try {
        //Para ello, se usa .verify, donde se pasa el token que el cliente envía en esta solicitud, y como parámetro para .verify, la clave secreta
        //La forma en cómo se verificará es que a partir de la clave secreta (puesto que esta fue usada para firmar y crear el token), si este
        //es el token correcto, deberá ser el mismo token (en caso no haya una modificación)
        const verificado = jwt.verify(token, process.env.JWT_SECRET);

        //Ahora, en el objeto 'req', se le agrega la propiedad .usuario=verificado para indicar que la autorización fue permitida
        req.usuario = verificado;

        //Se usa next para indicar que el middleware permita el paso de esta solicitud y el flujo siga dándose
        next();
    }catch (error){
        //Si el token no coincide con el inicial, entonces se envía el error
        res.status(400).json({error:'Token inválido.'});
    }
};

const autorizar = (roles = []) => {
  // Si se pasa un solo rol como string, se convierte en un array para manejar todos los casos de manera uniforme.
  if (typeof roles === 'string') roles = [roles];
  return [
    // verifica que el usuario esté autenticado y tenga un token JWT válido.
    autenticar,
    (req, res, next) => {
      if (!roles.length || roles.includes(req.usuario.rol)) {
        return next();
      }
      return res.status(403).json({ error: 'No tienes permisos para realizar esta acción.' });
    },
  ];
};

module.exports = { autenticar, autorizar };