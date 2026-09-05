{
  description = "Bun + Foldkit.dev + Nodejs";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      nixpkgs,
      flake-utils,
      ...
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs { inherit system; };
        devShell = pkgs.mkShell {
          buildInputs = [
            pkgs.bun
            pkgs.nodejs # Menggunakan Node.js versi aktif dari nixpkgs
            pkgs.turso-cli # Menambahkan Turso CLI
          ];

          shellHook = ''
            echo "ℹ️  Dev shell ready (Nix Environment)"
          '';
        };
      in
      {
        devShells.default = devShell;
        devShells.ci = devShell; 
      }
    );
}