#!/bin/bash
# Sources are bundled with this package; no invented upstream URL or checksum.
oscar_install_files() {
    : "${app:?}" "${install_dir:?}" "${data_dir:?}"
    # The bundle has only application files; never copy the working tree or secrets.
    install -d -m 750 "$install_dir/web" "$install_dir/server"
    rsync -a --delete ../web/ "$install_dir/web/"
    rsync -a --delete --exclude='__pycache__' ../server/ "$install_dir/server/"
    install -m 640 ../requirements.txt "$install_dir/requirements.txt"
    python3 -m venv "$install_dir/venv"
    "$install_dir/venv/bin/pip" install --disable-pip-version-check -r "$install_dir/requirements.txt"
    chown -R "$app:www-data" "$install_dir"
    chmod 750 "$install_dir" "$install_dir/web" "$install_dir/server"
    chown -R "$app:$app" "$data_dir"
    chmod 700 "$data_dir"
}
