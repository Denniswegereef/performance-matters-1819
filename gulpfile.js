var gulp = require('gulp')
var pipeline = require('readable-stream').pipeline
const minify = require('gulp-minify')
const rev = require('gulp-rev')
var revReplace = require('gulp-rev-replace')

var clean = require('gulp-clean')

const public = 'server/public'
const dist = 'server/dist'

gulp.task('clean', async () => {
  await gulp.src(dist, { read: false }).pipe(clean())
})

gulp.task('min-js', async () => {
  return (
    gulp
      .src(public + '/js/*.js')
      .pipe(minify())
      // .pipe(rev())
      // .pipe(
      //   rev.manifest({
      //     base: dist,
      //     merge: true // Merge with the existing manifest if one exists
      //   })
      // )
      .pipe(gulp.dest(dist + '/js'))
  )
})

gulp.task('move', async () => {
  gulp.src(public + '/images/**/*').pipe(gulp.dest(dist + '/images'))
  gulp.src(public + '/fonts/**/*').pipe(gulp.dest(dist + '/fonts'))
})

// gulp.task('revreplace', ['revision'], () => {
//   var manifest = gulp.src('./server/rev-manifest.json')

//   return gulp
//     .src('./server/views/discover.hbs')
//     .pipe(revReplace({ manifest: manifest }))
//     .pipe(gulp.dest(opt.distFolder))
// })
