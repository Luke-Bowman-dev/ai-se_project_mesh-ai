import morgan from 'morgan';

const devFormat = ':method :url :status :response-time ms';
const isProduction = process.env.NODE_ENV === 'production';
const logFormat = isProduction? 'combined' : devFormat;

export const RequestLogger = morgan(logFormat);