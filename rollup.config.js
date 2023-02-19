import typescript from '@rollup/plugin-typescript'
import tsConfig from './tsconfig.json' assert { type: 'json'}
import { execSync } from 'child_process'




// const templates = (await readdir('./src/templates')).map(path => join('./src/templates', path))
const clean = () => {
  execSync('rm -rf www/*.js')
  return
}

export default [{
  input: ['src/token.ts', 'src/roles.ts'],
  output: {
    dir: './exports',
    format: 'es'
  },
  plugins: [
    typescript(tsConfig)
  ]
}]