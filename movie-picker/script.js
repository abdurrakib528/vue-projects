var vm = new Vue({
  el: "#app",
  data: {
    isCartOpen: false,
    movies: [],
    keyword: "",
    cart: [],
    currentMovie: null
  },
  //取得電影資料
  created(){
    let apiUrl = "https://awiclass.monoame.com/api/command.php?type=get&name=movies"
    axios.get(apiUrl).then(res=>{
      this.movies=res.data
    })
  },
  methods: {
    bgcss(url){
      return {'background-image': 'url('+url+')',
             'background-size': 'cover',
             'background-position': 'center center'}
    },
    wheel(evt){
      console.log(evt.deltaY)
      TweenMax.to(".cards",0.8,{
        left: "+="+evt.deltaY*2+"px"
      })
    },
    addCart(movie,evt){
      this.currentMovie=movie
      this.$nextTick(()=>{
        TweenMax.from(".buybox",0.8,{
          left: $(evt.target).offset().left,
          top: $(evt.target).offset().top,
          opacity: 1,
          ease: Power1.easeIn
        })
        setTimeout(()=>{
          this.cart.push(movie)
        },800)
      })
      
    }
  },
  computed: {
    totalPrice(){
      return this.cart
        .map(movie=>movie.price)
        .reduce((total,p)=>total+p,0)
    }
  },
  watch: {
    cart(){
      TweenMax.from(".fa-shopping-cart",0.3,{
        scale: 0.5
      })
    }
  }
})