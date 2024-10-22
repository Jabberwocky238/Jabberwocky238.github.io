import Link from '@docusaurus/Link';
import styles from './styles.module.css';

export default function (props: { to: string, children: string, padding?: boolean }): JSX.Element {
    let padding = props.padding;
    if (typeof padding === 'undefined') {
        padding = true;
    }
    return (
        <div className={styles.buttons} style={{ padding: padding ? "12px" : "none" }}>
            <Link
                className="button button--secondary button--lg"
                to={props.to}>
                {props.children}
            </Link>
        </div>
    );
}
