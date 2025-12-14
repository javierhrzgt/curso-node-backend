import boom from '@hapi/boom';

export default function validatorHandler(schema, property) {
  return (req, res, next) => {
    const data = req[property];
    const { error } = schema.validate(data, {
      abortEarly: false,
      // convert: true, // Por defecto es true, permite conversión de tipos
    });
    if (error) {
      next(boom.badRequest(error));
    } else {
      next();
    }
  };
}
