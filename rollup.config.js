/**
 * The following are the devDependencies needed,
 * you can also install them directly by using:
 * yarn add --dev rollup rollup-plugin-sass rollup-plugin-typescript2
 * The devDependencies:
 * rollup
 * rollup-plugin-sass
 * rollup-plugin-typescript2
 * */
import sass from 'rollup-plugin-sass'
import typescript from 'rollup-plugin-typescript2'

export default {
  input: 'src/index',
  output: [
    {
      dir: 'lib',
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
      strict: false
    }
  ],
  plugins: [sass({insert: true}), typescript()],
  external: ['react', 'react-dom']
}
