import {Card} from "react-bootstrap"
import style from "./CardLiteratur.module.css"
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import { Link } from "react-router-dom";

export default function CardLiteratur({data}) {
  return (
    <Card className={`${style.Card}`}>
        <Card.Body className="d-flex flex-column justify-content-between ">
          <Link to={`/literature/${data.id}`}>
            <Document file={data.files}>
              <Page pageNumber={1} height={300} loading="Loading pdf.." />
            </Document>
          </Link>
        <div>
          <Card.Title className={style.Title}>{data.title}</Card.Title>
          <div className="d-flex justify-content-between">
            <Card.Text className={style.Subtitle}>{data.author}</Card.Text>
            <Card.Text className={style.Subtitle}>{data.pubDate.slice(0,4)}</Card.Text>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}
