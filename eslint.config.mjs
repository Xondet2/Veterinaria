import next from 'eslint-config-next'

const config = [
  ...next,
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'dist/**',
      'build/**',
      'springboot/**',
      'springboot/**/target/**',
      'springboot/**/build/**',
      'springboot/**/generated-sources/**',
      'app/register/**',
      'lib/__tests__/**',
      'scripts/**'
    ],
    rules: {
      'react-hooks/set-state-in-effect': 'off',
      '@next/next/no-html-link-for-pages': 'off'
    }
  }
]

export default config