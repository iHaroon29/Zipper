import { generateToken, verifyToken } from '../utils/jwt_utils.js'

const authenticateUser = async (req, res, next) => {
  try {
    let tokenData = crypto.randomUUID()
    const token = await generateToken(tokenData)
    if (token instanceof Error) throw token
    res.cookie('token', token, {
      maxAge: 60 * 60 * 24,
      httpOnly: true,
      sameSite: 'none',
      secure: false,
    })
    res.status(200).send('OK')
  } catch (e) {
    next(e)
  }
}

const verifyUser = async (req, res, next) => {
  try {
    const { token } = req.cookies
    const tokenResp = await verifyToken(token)
    if (tokenResp instanceof Error) throw tokenResp
    if (!tokenResp.valid) {
      let tokenData = crypto.randomUUID()
      const newToken = await generateToken(tokenData)
      if (newToken instanceof Error) throw newToken
      res.cookie('token', newToken, {
        maxAge: 60 * 60 * 24,
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      })
    }
    next()
  } catch (e) {
    next(e)
  }
}

export { authenticateUser, verifyUser }
