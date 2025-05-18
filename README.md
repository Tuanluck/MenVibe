# MenVibe - Danh sách chức năng chính

## User Roles
- Guest (chưa đăng nhập)
- User (đã đăng nhập)
- Admin (quản trị)

---

## Chức năng Guest

- Xem danh sách sản phẩm theo danh mục, tìm kiếm, lọc
- Xem chi tiết sản phẩm
- Thêm sản phẩm vào giỏ hàng tạm (LocalStorage)
- Đăng ký tài khoản
- Đăng nhập

---

## Chức năng User

- Tất cả chức năng của Guest
- Quản lý giỏ hàng (Thêm, xóa, sửa số lượng)
- Đặt hàng, nhập địa chỉ nhận hàng
- Xem và theo dõi trạng thái đơn hàng
- Cập nhật thông tin cá nhân (tên, email, mật khẩu)
- Đăng xuất

---

## Chức năng Admin

- Đăng nhập admin riêng
- Quản lý sản phẩm (Thêm, sửa, xóa)
- Quản lý danh mục sản phẩm
- Quản lý đơn hàng (xem, cập nhật trạng thái)
- Quản lý người dùng (danh sách, khóa tài khoản)
- Xem thống kê doanh thu, số đơn hàng theo ngày/tháng

---

## Công nghệ sử dụng

- Frontend: ReactJS + TailwindCSS + React Router + fetch + LocalStorage
- Backend: Java Spring Boot MVC + JWT + Spring Data JPA + MySQL
