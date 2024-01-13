const loginDialog = `<div class="modal fade" id="login-dialog" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-backdrop="static">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Login</h5>
          </div>
          <div class="modal-body">
            <div class="container" id="login-content">
              <div>
                <label for="username" class="form-label">Username</label>
                <input type="text" class="form-control" id="username" placeholder="Masukkan username"
                  autocomplete="username" />
              </div>
              <div class="mt-2">
                <label for="password" class="form-label">Password</label>
                <input type="password" class="form-control" id="password" placeholder="Masukkan password" />
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary" id="login">Login</button>
            </div>
          </div>
        </div>
      </div>`

export default loginDialog