const gulp = require("gulp");
const sass = require("gulp-sass");

// Compile SASS and move it to public/css
gulp.task("sass", function() {
    return gulp
        .src(["public/scss/style.scss"])
        .pipe(sass())
        .pipe(gulp.dest("public/css"));
});

// Serve and Watch Changes
gulp.task("serve", ["sass"], function() {
    gulp.watch(["public/scss/*.scss", "public/scss/*/*.scss"], ["sass"]);
});

gulp.task("default", ["serve"]);