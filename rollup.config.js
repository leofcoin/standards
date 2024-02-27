import typescript from '@rollup/plugin-typescript'
import { execSync } from 'child_process'

// const templates = (await readdir('./src/templates')).map(path => join('./src/templates', path))
const clean = () => {
  execSync('rm -rf www/*.js')
  return
}

export default [
  {
    input: [
      'src/index.ts',
      'src/token.ts',
      'src/roles.ts',
      'src/voting/public-voting.ts',
      'src/voting/private-voting.ts',
      'src/helpers.ts',
      'src/token-receiver.ts'
    ],
    output: {
      dir: './exports',
      format: 'es'
    },
    plugins: [typescript()]
  }
]
