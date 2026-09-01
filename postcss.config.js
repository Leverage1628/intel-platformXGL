module.exports = {
  plugins: [
    require('@fullhuman/postcss-purgecss')({
      content: ['./**/*.html','./**/*.js'],
      safelist: {
        standard: [/^tab/,/^row/,/^btn/,/^chip/,/^hero/,/^gauge/]
      },
      defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+(?<!:)/g) || []
    }),
    require('cssnano')({ preset: 'default' })
  ]
};
