import React from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Helmet } from "react-helmet";
import Swal from "sweetalert2";
import { axiosBlogsByUser, axiosDeleteBlogUser } from "../../../redux/index";
import { SidebarDashboard } from "../../../components/common/sidebar/SidebarDashboard";
import { AiOutlineMenu } from "react-icons/ai";
import { AiOutlineClose } from "react-icons/ai";
import style from "./style_blogs_user.module.css";

export function BlogsUser() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const infoBlogsByUser = useSelector((state) => state.blogsByUser);
  const infoCreateBlog = useSelector((state) => state.createBlogUser);
  const infoUpdateBlogUser = useSelector((state) => state.updateBlogUser);
  const infoDeleteBlogUser = useSelector((state) => state.deleteBlogUser);

  const access = JSON.parse(localStorage.getItem("access"));

  const [allVisibility, setAllVisibility] = useState("0");
  const [allVisibilityPage, setAllVisibilityPage] = useState("0");
  const [nextBlogPages, setNextBlogPages] = useState({});

  const page = new URLSearchParams(location.search).get("page");

  // dom with css
  const [navegationScrollAppearance, setNavegationScrollAppearance] =
    useState(false);
  const [valueScrollApearence, setValueScrollApearence] = useState(
    <AiOutlineMenu />
  );

  // States of create, update and delete blog
  useEffect(() => {
    if (
      infoCreateBlog.status === "fulfilled" ||
      infoUpdateBlogUser.status === "fulfilled" ||
      infoDeleteBlogUser.status === "fulfilled"
    ) {
      dispatch(axiosBlogsByUser(access));
      setAllVisibility("0");
    }
  }, [
    infoDeleteBlogUser.status,
    infoCreateBlog.status,
    infoUpdateBlogUser.status,
  ]);

  useEffect(() => {
    if (page) {
      const headers = {
        Authorization: `JWT ${access}`,
      };
      const url = `http://127.0.0.1:8000/dashboard/blog_by_user/?page=${page}`;
      fetch(url, {
        method: "GET",
        headers,
      })
        .then((res) => {
          if (!res.ok) {
            if (page > 1) {
              navigate(`/dashboard/blogs_user?page=${page - 1}`);
            } else {
              navigate(`/dashboard/blogs_user`);
            }
          }
          return res.json();
        })
        .then((data) => {
          setNextBlogPages(data);
          setTimeout(() => {
            setAllVisibilityPage("1");
          }, 350);
        })
        .catch((err) => console.log(err));
    }
  }, [page]);

  setTimeout(function () {
    setAllVisibility("1");
  }, 350);

  function refreshBloByUserPagination() {
    setTimeout(() => {
      const headers = {
        Authorization: `JWT ${access}`,
      };
      const url = `http://127.0.0.1:8000/dashboard/blog_by_user/?page=${page}`;
      fetch(url, {
        method: "GET",
        headers,
      })
        .then((res) => {
          if (!res.ok) {
            if (page > 1) {
              navigate(`/dashboard/blogs_user?page=${page - 1}`);
            } else {
              navigate(`/dashboard/blogs_user`);
            }
          }
          return res.json();
        })
        .then((data) => setNextBlogPages(data));
    }, 200);
  }

  function buttonsPagination() {
    const countBlogsPaginate = infoBlogsByUser.info.count / 5;
    const paginateCheck = countBlogsPaginate.toString().split(".");
    if (paginateCheck.length === 1) {
      const list = [];
      for (let i = 1; i <= Number(paginateCheck[0]); i++) {
        list.push(i);
      }
      if (list.length > 1) {
        return list.map((index) => {
          return (
            <button
              key={index}
              onClick={(e) => {
                setAllVisibilityPage("0");
                navigate(`/dashboard/blogs_user?page=${index}`);
              }}
            >
              {index}
            </button>
          );
        });
      }
    } else {
      const list = [];
      for (let i = 1; i <= Number(paginateCheck[0]) + 1; i++) {
        list.push(i);
      }
      if (list.length > 1) {
        return list.map((index) => {
          return (
            <button
              key={index}
              onClick={(e) => {
                setAllVisibilityPage("0");
                navigate(`/dashboard/blogs_user?page=${index}`);
              }}
            >
              {index}
            </button>
          );
        });
      }
    }
  }

  function deleteBlogByUser(data) {
    Swal.fire({
      title: "Eliminar",
      text: "Estas seguro que deseas eliminar este blog?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Si, eliminar!",
    }).then((result) => {
      if (result.isConfirmed) {
        if (page) {
          dispatch(axiosDeleteBlogUser(data));
          setAllVisibility("0");
          refreshBloByUserPagination();
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener("mouseenter", Swal.stopTimer);
              toast.addEventListener("mouseleave", Swal.resumeTimer);
            },
          });

          Toast.fire({
            icon: "error",
            title: "Blog eliminado",
          });
        } else {
          dispatch(axiosDeleteBlogUser(data));
          setAllVisibility("0");
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener("mouseenter", Swal.stopTimer);
              toast.addEventListener("mouseleave", Swal.resumeTimer);
            },
          });

          Toast.fire({
            icon: "error",
            title: "Blog eliminado",
          });
        }
      }
    });
  }

  return (
    <main className={style.viewInitalBlogByUser}>
      <Helmet>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title> Dashboard </title>
      </Helmet>

      <SidebarDashboard appearance={navegationScrollAppearance} />

      <article className={style.containerBlogsUser}>
        <nav>
          <Link className={style.linkNavbar} to={"/dashboard/create_blog"}>
            Crear blog
          </Link>
        </nav>

        <h1 className={style.titleMajor}> Blogs registrados </h1>
        <div className={style.bottomNavegationScrollAppearance}>
          <h1
            onClick={(e) => {
              if (navegationScrollAppearance === false) {
                setNavegationScrollAppearance(true);
                setValueScrollApearence(<AiOutlineClose />);
              } else {
                setNavegationScrollAppearance(false);
                setValueScrollApearence(<AiOutlineMenu />);
              }
            }}
          >
            {valueScrollApearence}
          </h1>
        </div>

        <div style={{ opacity: allVisibility }}>
          <div>
            {infoBlogsByUser.status === "pending" ? (
              <h1> Cargando... </h1>
            ) : infoBlogsByUser.status === "fulfilled" && !location.search ? (
              <div>
                {infoBlogsByUser.info.results?.map((data) => {
                  return (
                    <aside
                      className={style.separateBlogContainer}
                      key={data.id}
                    >
                      <div className={style.containerImg}>
                        <img
                          src={`http://localhost:8000${data.img}`}
                          alt="img"
                        />
                      </div>
                      <div className={style.containerContent}>
                        <h1> {data.title} </h1>
                        <p> {data.description} </p>
                        <hr style={{ border: "2px solid gray" }} />
                        <div></div>
                        <div className={style.containerButtonsAndDate}>
                          <div className={style.containerButtons}>
                            <button
                              className={style.buttonDelete}
                              onClick={() => {
                                const info = {
                                  jwt: access,
                                  slug: `${data.slug}`,
                                };
                                deleteBlogByUser(info);
                              }}
                            >
                              Eliminar
                            </button>
                            <button
                              className={style.buttonUpdate}
                              onClick={(e) => {
                                navigate(
                                  `/dashboard/blog_user_detail/${data.slug}`
                                );
                              }}
                            >
                              Modificar
                            </button>
                          </div>
                          <b> {data.creation} </b>
                        </div>
                      </div>
                    </aside>
                  );
                })}
                <div>
                  {infoBlogsByUser.status === "fulfilled"
                    ? buttonsPagination()
                    : false}
                </div>
              </div>
            ) : Object.keys(nextBlogPages).length !== 0 ? (
              <div style={{ opacity: allVisibilityPage }}>
                {nextBlogPages.results?.map((data) => {
                  return (
                    <aside
                      className={style.separateBlogContainer}
                      key={data.id}
                    >
                      <div className={style.containerImg}>
                        <img
                          src={`http://localhost:8000${data.img}`}
                          alt="img"
                        />
                      </div>
                      <div className={style.containerContent}>
                        <h1> {data.title} </h1>
                        <p> {data.description} </p>
                        <hr style={{ border: "2px solid gray" }} />
                        <div></div>
                        <div className={style.containerButtonsAndDate}>
                          <div className={style.containerButtons}>
                            <button
                              className={style.buttonDelete}
                              onClick={() => {
                                const info = {
                                  jwt: access,
                                  slug: `${data.slug}`,
                                };
                                deleteBlogByUser(info);
                              }}
                            >
                              Eliminar
                            </button>
                            <button
                              className={style.buttonUpdate}
                              onClick={(e) => {
                                navigate(
                                  `/dashboard/blog_user_detail/${data.slug}`
                                );
                              }}
                            >
                              Modificar
                            </button>
                          </div>
                          <b> {data.creation} </b>
                        </div>
                      </div>
                    </aside>
                  );
                })}
                <div>
                  {infoBlogsByUser.status === "fulfilled"
                    ? buttonsPagination()
                    : false}
                </div>
              </div>
            ) : infoBlogsByUser.status === "rejected" ? (
              <p> No hay blogs</p>
            ) : (
              false
            )}
          </div>
        </div>
      </article>
    </main>
  );
}
