export default function ProfileInfo({data}) {
    return (
      <>
        <div className="d-flex" style={{ lineHeight: "19px" }}>
          <img src={`/assets/icons/${data.img}`} alt="" width="36" height="36" className="me-3" />
          <div>
            <p className="fw-bold m-0">
              {data.name}
            </p>
            <p className="">{data.info}</p>
          </div>
        </div>
      </>
    );
  }
  