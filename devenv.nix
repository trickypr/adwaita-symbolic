{ pkgs, lib, config, inputs, ... }:

{
  # https://devenv.sh/packages/
  packages = [ pkgs.git pkgs.nodejs pkgs.meson pkgs.gtk4 pkgs.ninja ];

  # https://devenv.sh/scripts/
  scripts = {
    adwaita.exec = "cd adwaita-icon-theme && meson setup builddir && cd builddir && meson compile";
    flat.exec = "rm -rf symbolic && mkdir symbolic && cp -r adwaita-icon-theme/Adwaita/symbolic/* ./symbolic";
    gecko.exec = "node ./scripts/gecko-css.js";
    
    format.exec = "pnpm prettier --write ./scripts";
  };
}
