import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import colorCodes from "../themes/colorCodes";
import fonts from "../themes/fonts";
import Overlay from "react-native-modal-overlay";
var close = require("../../assets/imgs/close.png");

class InfoModal extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { visible, closed } = this.props;
    return (
      <Overlay
        visible={visible}
        onClose={closed}
        closeOnTouchOutside
        animationType={"bounceIn"}
        childrenWrapperStyle={{ borderWidth: 1, borderRadius: 5, zIndex: 300 }}
      >
        <View>
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                fontFamily: fonts.bold,
                color: colorCodes.textColor,
                fontSize: 16,
              }}
            >
              Terms and Conditions
            </Text>
            <TouchableOpacity
              style={{ position: "absolute", right: 0, top: -5 }}
              onPress={closed}
            >
              <Image style={{ width: 30, height: 30 }} source={close} />
            </TouchableOpacity>
          </View>
          <ScrollView
            disableScrollViewPanResponder={true}
            nestedScrollEnabled={false}
            style={{ zIndex: 300 }}
            contentContainerStyle={{ marginBottom: 5 }}
          >
            <Text style={[styles.tcPara, { marginTop: 10 }]}>
              This website/app is provided by InCuberMax and its affiliates
              (collectively, “InCuberMax ”). The terms "we", "us", "our" and
              "InCuberMax" refer to InCuberMax, and our corporate affiliates and
              websites (collectively, "InCuberMax"). Get The terms "You" and
              "User" refer to visitors and users of the website or app
              (collectively, “the Service”).
            </Text>
            <Text style={[styles.tcPara, { marginTop: 10 }]}>
              The Service is offered to you conditioned upon your acceptance
              without modification of any/all the terms, conditions, and notices
              set forth below (collectively, the "Agreement"). By accessing or
              using this Service in any manner, whether through a computer, a
              mobile phone or any other device, you agree to be bound by the
              Agreement and represent that you have read and understood its
              terms. Please read the Agreement carefully, as it contains
              information concerning your legal rights and limitations on these
              rights, as well as a section regarding applicable law and
              jurisdiction of disputes. If you do not accept all of these terms
              and conditions you are not authorized to use this Service.
            </Text>
            <Text style={[styles.tcPara, { marginTop: 10 }]}>
              We may change or otherwise modify the Agreement in the future in
              accordance with the Terms and Conditions herein, and you
              understand and agree that your continued access or use of this
              Website after such change signifies your acceptance of the updated
              or modified Agreement. Be sure to return to this page periodically
              to review the most current version of the Agreement.
            </Text>
            <Text style={[styles.tcPara, { marginTop: 10 }]}>
              You warrant that you possess the legal authority to enter into
              this Agreement under the applicable laws and to use this Website
              in accordance with all terms and conditions herein
            </Text>

            <Text style={styles.tcHeading}>Privacy Policy</Text>
            <Text style={[styles.tcPara, { marginTop: 10 }]}>
              InCuberMax believes in protecting your privacy. Any personal
              information you provided to us during your use of the Service will
              be used in accordance with our Privacy Policy. Our Privacy Policy
              forms a part of these Terms.
            </Text>

            <Text style={styles.tcHeading}>Third Party Content</Text>
            <Text style={[styles.tcPara, { marginTop: 10 }]}>
              The Service may contain links to external third party websites,
              apps or services. InCuberMax does not guarantee, approve or
              endorse the information or products available on these third party
              websites, nor does a link indicate any association with or
              endorsement of the linked website.
            </Text>
            <Text style={[styles.tcPara, { marginTop: 10 }]}>
              We do not operate or control and have no responsibility for the
              information, products and/or services found on any external sites.
              Nor does it represent or endorse the accuracy or reliability of
              any information, products and/or services provided on or through
              any external sites, including, without limitation, warranties of
              any kind, either express or implied, warranties of title or
              non-infringement or implied warranties of merchant-ability or
              fitness for a particular purpose.
            </Text>
            <Text style={[styles.tcPara, { marginTop: 10 }]}>
              Users of the Service assume complete responsibility and risk in
              their use of any external sites. Users should direct any concerns
              regarding any external link to the relevant website’s
              administrator or webmaster. Users are hereby informed to exercise
              utmost caution when visiting any third party website.
            </Text>

            <Text style={styles.tcHeading}>Intellectual Property</Text>
            <Text style={[styles.tcPara, { marginTop: 10 }]}>
              All material, data and information included on the Service (the
              “Content”) is the property of InCuberMax, its subsidiaries,
              affiliated companies, suppliers and/or customers and is protected
              by international copyright laws. Any unauthorized modification or
              use of the Content violates InCuberMax’s intellectual property
              rights and is prohibited. Copying, transmission, reproduction,
              replication, posting or redistribution of the Content or any
              portion thereof is strictly prohibited without the prior written
              permission of InCuberMax. To request permission, you may contact
              InCuberMax at support@incubermax.com.
            </Text>
            <Text style={[styles.tcPara, { marginTop: 10 }]}>
              You should assume that everything you see or read on the Service
              is proprietary information unless otherwise noted and may not be
              used except as provided in these Terms of Use or with InCuberMax’s
              prior written consent in each case. Nothing posted on the Service
              grants a license to any trademarks, copyrights or other
              intellectual property rights, whether by implication, estoppel or
              otherwise. Trademarks displayed on the Service not owned by
              InCuberMax are the property of their respective owners.
            </Text>

            <Text style={styles.tcHeading}>Limitation on Use</Text>
            <Text style={styles.tcHeading}>You agree not to:</Text>
            <Text style={[styles.tcPara, { marginTop: 10 }]}>
              (a) access, monitor or copy any content or information from this
              Service using any robot, spider, scraper or other automated means
              or any manual process for any purpose without our express written
              permission;
            </Text>
            <Text style={[styles.tcPara, { marginTop: 10 }]}>
              (b) take any action that imposes, or may impose, in our
              discretion, an unreasonable or disproportionately large load on
              our infrastructure;
            </Text>
            <Text style={[styles.tcPara, { marginTop: 10 }]}>
              (c) "frame", "mirror" or otherwise incorporate any part of this
              Service into any other website without our prior written
              authorization; or
            </Text>
            <Text style={[styles.tcPara, { marginTop: 10 }]}>
              (d) attempt to modify, translate, adapt, edit, decompile,
              disassemble, or reverse engineer any software programs used by
              InCuberMax in connection with the Service or the services.
            </Text>

            <Text style={styles.tcHeading}>Indemnity</Text>
            <Text style={[styles.tcPara, { marginTop: 10 }]}>
              You agree to defend and indemnify InCuberMax and its affiliates
              and any of their officers, directors, employees and agents from
              and against any claims, causes of action, demands, recoveries,
              losses, damages, fines, penalties or other costs or expenses of
              any kind or nature including but not limited to reasonable legal
              and accounting fees brought by third parties as a result of:
            </Text>
            <Text style={[styles.tcPara, { marginTop: 10 }]}>
              (a) your breach of this Agreement or the documents referenced
              herein;
            </Text>
            <Text style={[styles.tcPara, { marginTop: 10 }]}>
              (b) your violation of any law or the rights of a third party; or
            </Text>
            <Text style={[styles.tcPara, { marginTop: 10 }]}>
              (c) your use of this Service.
            </Text>

            <Text style={styles.tcHeading}>Notice and Take-Down</Text>
            <Text style={[styles.tcPara, { marginTop: 10 }]}>
              If you have any complaints or objections to material or content
              posted on the Service, or if you believe that material or content
              posted on the Service infringes a copyright or trademark or any
              other Intellectual Property Rights that you hold, please contact
              us immediately at support@incubermax.com to initiate the takedown
              process. Once the takedown process has been initiated, InCuberMax
              will make all reasonable efforts to remove illegal content within
              a reasonable time.
            </Text>

            <Text style={styles.tcHeading}>Modifications to the Service</Text>
            <Text style={[styles.tcPara, { marginTop: 10 }]}>
              The Content and the functionality of the Service may be updated or
              changed at any time without prior notice.
            </Text>

            <Text style={styles.tcHeading}>Modifications to these Terms</Text>
            <Text style={[styles.tcPara, { marginTop: 10 }]}>
              InCuberMax may change, add or delete these Terms of Use or any
              portion thereof from time to time in its sole discretion where it
              deems it necessary for legal, general regulatory and technical
              purposes, or due to changes in the services provided or nature or
              layout of the Service. By continuing to use this website after
              such a modification, you agree to be bound by any such amended
              Terms of Use.
            </Text>

            <Text style={styles.tcHeading}>Modifications to these Terms</Text>
            <Text style={[styles.tcPara, { marginTop: 10 }]}>
              InCuberMax may change, add or delete these Terms of Use or any
              portion thereof from time to time in its sole discretion where it
              deems it necessary for legal, general regulatory and technical
              purposes, or due to changes in the services provided or nature or
              layout of the Service. By continuing to use this website after
              such a modification, you agree to be bound by any such amended
              Terms of Use.
            </Text>
            <Text style={[styles.tcPara, { marginTop: 10 }]}>
              InCuberMax may change, suspend or discontinue any aspect of the
              Service at any time, including availability of any feature,
              database or content. InCuberMax may also impose limits on certain
              features and services or restrict your access to all or parts of
              the Service without notice or liability for technical or security
              reasons, to prevent against unauthorized access, loss of, or
              destruction of data or where we consider in our sole discretion
              that you are in breach of any provision of these Terms of Use or
              of any law or regulation in force in a jurisdiction in which
              InCuberMax operates.
            </Text>

            <Text style={styles.tcHeading}>Warranty Disclaimer</Text>
            <Text style={[styles.tcPara, { marginTop: 10 }]}>
              Though all efforts have been made to ensure the accuracy of the
              Content, InCuberMax does not guarantee that the Website or the
              Content is error free. InCuberMax makes no representations about
              the accuracy or functionality of the Service or that the Content
              is accurate, error free or up to date
            </Text>
            <Text style={[styles.tcPara, { marginTop: 10 }]}>
              Neither InCuberMax, any of its affiliates, directors, officers and
              employees, nor any other party involved in creating, producing or
              delivering the Service or the Content is liable for any direct,
              incidental, consequential, indirect or punitive damages arising
              out of your access to, or use of, the Service or the operation of
              the Service or failure of the Service to function in any way. In
              no event is InCuberMax liable for any direct, indirect,
              incidental, special, punitive, or consequential, damages or any
              damages whatsoever, even if InCuberMax has been previously advised
              of the possibility of such damages. These limitations shall apply
              notwithstanding any failure of essential purpose of any limited
              remedy. Your acceptance of this limitation of liability is an
              essential term of this agreement and You acknowledge that
              InCuberMax would not grant access to the Website without your
              agreement to this term
            </Text>

            <Text style={styles.tcHeading}>Remedies for Violations</Text>
            <Text style={[styles.tcPara, { marginTop: 10 }]}>
              InCuberMax reserves the right to seek all remedies available at
              law and in equity for violations of these Terms.
            </Text>

            <Text style={styles.tcHeading}>Governing Law and Jurisdiction</Text>
            <Text style={[styles.tcPara, { marginTop: 10 }]}>
              This Service is operated by InCuberMax, an Indian entity. This
              Agreement is governed by the laws applicable in India. You hereby
              consent to the exclusive jurisdiction and venue of courts in
              Kolkata, India
            </Text>

            <Text style={styles.tcHeading}>Sever-ability</Text>
            <Text style={[styles.tcPara, { marginTop: 10 }]}>
              If any term of this Agreement is found to be unlawful, void,
              illegal or unenforceable in any respect under any law, then that
              clause shall be deemed to be sever-able from the remaining clauses
              and the validity, legality and enforce-ability of other clauses
              shall not be affected in any way.
            </Text>

            <Text style={styles.tcHeading}>Entire Agreement</Text>
            <Text style={[styles.tcPara, { marginTop: 10 }]}>
              This Agreement constitutes the entire and whole agreement between
              the User and InCuberMax, this Agreement shall supersede all other
              communications between InCuberMax and its Users with respect to
              the subject matter hereof. If at any time, the User finds that the
              Terms under this Agreement are unacceptable or if the User does
              not agree to these Terms, then the user may not use this Service.
              Continued use by any user shall be sufficient to indicate
              acceptance of all terms under this Agreement.
            </Text>

            <Text style={styles.tcHeading}>Contact Information</Text>
            <Text style={[styles.tcPara, { marginTop: 10 }]}>
              For answers to your questions or any other help required, you may
              contact us at support@incubermax.com
            </Text>

            <Text style={styles.tcPara}>
              Thank you for visiting our website.
            </Text>
          </ScrollView>
        </View>
      </Overlay>
    );
  }
}

const styles = StyleSheet.create({
  tcHeading: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colorCodes.textColor,
    paddingTop: 10,
  },
  tcPara: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colorCodes.textColor,
  },
});
export default InfoModal;
