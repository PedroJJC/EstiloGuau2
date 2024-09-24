import flowbite from "flowbite-react/tailwind";
/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [ 
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
    ,flowbite.content(),],
    
  theme: {
    extend: {
    
      height: {
        'custom': '56px',  // Altura por defecto
        'custom-md': '64px',  // Altura para sm
        'custom-lg': '80px',  // Altura para lg
        'custom-xl': '96px',  // Altura para xl
        'custom-2xl': '900px',  // Altura para 2xl
        'imagen-2x1': '600px',
        'imagen2-2x1': '900px'
      },


      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
      },     
      colors: {
        custom: '#CDD5AE',
        second: '#E9EDC9',
        amario: '#FFFF00',
      },
      letterSpacing: {
        widest: '0.7em', // Ajusta este valor según tus necesidades
      }, 
    },
  },
  plugins: [flowbite.plugin(),],

}