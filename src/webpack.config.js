import webpack from 'webpack'

module.exports = {
  plugins: [
    new webpack.EnvironmentPlugin([
      'NODE_ENV',
       'S3_PUBLIC_ACCESS_KEY'
    ])
  ]
}
