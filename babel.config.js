// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      //'nativewind/babel', // Plugin do NativeWind
      // Outros plugins do Babel, se você tiver, entram aqui como strings separadas por vírgula
      // Por exemplo: 'react-native-reanimated/plugin', (se você usar Reanimated)
    ],
  };
};