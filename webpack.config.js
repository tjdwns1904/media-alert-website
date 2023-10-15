var config = {
    entry: './main.js',
     
    output: {
       path:'/',
       filename: 'index.js',
    },
     
    devServer: {
       inline: true,
       port: 8080
    },
     
    module: {
       loaders: [
          {
             test: /\.jsx?$/,
             exclude: /node_modules/,
             loader: 'babel-loader',
                 
             query: {
                presets: ['es2015', 'react']
             }
          },
          {
            test: /\.css$/,
            loader: 'style-loader!css-loader'
          },
          {
            test: /\.s[a|c]ss$/,
            loader: 'sass-loader!style-loader!css-loader'
          },
          {
            test: /\.(jpg|png|gif|jpeg|woff|woff2|eot|ttf|svg)$/,
            loader: 'url-loader?limit=100000'
          }
       ]
    }
 }
 
 module.exports = config;