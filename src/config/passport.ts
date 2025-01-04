import { envs } from '../../config';
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { db } from '../models';
import { USER_STATUS } from '../constants/user';
import { ResponseMessages } from '../constants/responseMessages';

const { User, Role } = db;

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: envs.JWT_SECRET,
};

passport.use(
    new JwtStrategy(options, async (payload, done) => {
        try {
            let user = await User.findOne({
                where: { id: payload.id },
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'password']
                },
                include: {
                    model: Role,
                    attributes: ['name']
                }
                
            });
    
            user = user.toJSON();

            if (user) {
                if (user.status !== USER_STATUS.ACTIVE) {
                    // User not ACTIVE
                    return done(null, null, {message: ResponseMessages.USER_NOT_ACTIVE});
                }
                return done(null, user);
            }
            return done(null, false);
        } catch (error) {
            return done(error, false);
        }
    })
);

export default passport;